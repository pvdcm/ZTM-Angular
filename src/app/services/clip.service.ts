import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of, BehaviorSubject, combineLatest, lastValueFrom } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip | null> {

  public clipsCollection: AngularFirestoreCollection<IClip>
  pageClips: IClip[] = []
  pendingReq = false
  // ADICIONADO: Para controlar clips já carregados no modo aleatório
  private loadedRandomClips: Set<string> = new Set()

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.clipsCollection = db.collection('clips')
  }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data)
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {
        const [user, sort] = values
        if (!user) {
          return of([])
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy(
          'timestamp',
          sort === '1' ? 'desc' : 'asc'
        )

        return query.get()

      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title
    })
  }

  async deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`)
    const screenshotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`)

    await clipRef.delete()
    await screenshotRef.delete()

    await this.clipsCollection.doc(clip.docID).delete()
  }

  async getClips(randomize: boolean = false) {
    if (this.pendingReq) {
      return
    }

    this.pendingReq = true
    
    try {
      if (randomize) {
        // MODO ALEATÓRIO: Busca clips que ainda não foram carregados
        const query = this.clipsCollection.ref
          .orderBy('timestamp', 'desc')
          .limit(50) // Busca mais clips para ter melhor variedade

        const snapshot = await query.get()
        const availableClips: IClip[] = []

        snapshot.forEach(doc => {
          const clipData = {
            docID: doc.id,
            ...doc.data()
          } as IClip

          // Só adiciona se ainda não foi carregado
          if (!this.loadedRandomClips.has(doc.id)) {
            availableClips.push(clipData)
          }
        })

        // Se não há clips novos disponíveis, resetar o controle
        if (availableClips.length < 6) {
          this.loadedRandomClips.clear()
          // Recarregar todos os clips
          snapshot.forEach(doc => {
            availableClips.push({
              docID: doc.id,
              ...doc.data()
            } as IClip)
          })
        }

        // Embaralhar e pegar 6 aleatórios
        this.shuffleArray(availableClips)
        const randomClips = availableClips.slice(0, 6)
        
        // Marcar como carregados
        randomClips.forEach(clip => {
          this.loadedRandomClips.add(clip.docID!)
        })

        this.pageClips.push(...randomClips)

      } else {
        // MODO NORMAL: Paginação como antes
        let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6)

        const { length } = this.pageClips
        if (length) {
          const lastDocID = this.pageClips[length - 1].docID
          const lastDoc = await lastValueFrom(this.clipsCollection.doc(lastDocID).get())
          query = query.startAfter(lastDoc)
        }

        const snapshot = await query.get()
        snapshot.forEach(doc => {
          this.pageClips.push({
            docID: doc.id,
            ...doc.data()
          } as IClip)
        })
      }
    } catch (error) {
      console.error('Erro ao carregar clips:', error)
    } finally {
      this.pendingReq = false
    }
  }

  // ADICIONADO: Método para resetar clips e controle de aleatórios
  resetClips() {
    this.pageClips = []
    this.loadedRandomClips.clear()
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.clipsCollection.doc(route.params['id'])
      .get()
      .pipe(
        map(snapshot => {
          const data = snapshot.data()

          if (!data) {
            this.router.navigate(['/'])
            return null
          }
          window.scrollTo(0, 130);
          return data
        })
      )
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}