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
    let query = this.clipsCollection.ref.orderBy(
      'timestamp', 'desc'
    ).limit(6)

    const { length } = this.pageClips

    if (length) {
      const lastDocID = this.pageClips[length - 1].docID
      // const lastDoc = await this.clipsCollection.doc(lastDocID).get()
      const lastDoc = await lastValueFrom(this.clipsCollection.doc(lastDocID).get())


      query = query.startAfter(lastDoc)
    }

    const snapshot = await query.get()
    const newClips: IClip[] = []

    // Primeiro, coleta todos os clips
    snapshot.forEach(doc => {
      newClips.push({
        docID: doc.id,
        ...doc.data()
      })
    })

    // NOVA PARTE: Se randomize for true, embaralha
    if (randomize) {
      this.shuffleArray(newClips)
    }

    // Adiciona ao array principal
    this.pageClips.push(...newClips)
    this.pendingReq = false
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
