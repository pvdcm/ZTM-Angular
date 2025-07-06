import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ClipService } from '../services/clip.service';



@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers: [DatePipe]
})
export class ClipsListComponent implements OnInit, OnDestroy {
  @Input() scrollable = true
  
  // NOVO: Propriedade para controlar modo aleatório
  randomMode = true

  constructor(public clipService: ClipService) {
    // MODIFICADO: Removido daqui, movido para ngOnInit
  }

  ngOnInit(): void {
    // NOVO: Carregar clips na inicialização
    this.loadClips()

    if (this.scrollable) {
      window.addEventListener('scroll', this.handleScroll)
    }
  }

  ngOnDestroy(): void {
    if (this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll)
    }

    this.clipService.pageClips = []
  }

  // NOVO: Método para carregar clips
  async loadClips() {
    await this.clipService.getClips(this.randomMode)
  }

  // NOVO: Método para alternar entre ordem normal e aleatória
  async toggleRandomMode() {
    this.randomMode = !this.randomMode
    
    // Reset dos clips e recarrega com nova ordem
    this.clipService.pageClips = []
    await this.loadClips()
  }

  // NOVO: Método para resetar e carregar clips frescos
  async refreshClips() {
    this.clipService.pageClips = []
    await this.loadClips()
  }

  // MODIFICADO: Agora usa o modo atual (normal ou aleatório)
  handleScroll = async () => {
    const { scrollTop, offsetHeight } = document.documentElement
    const { innerHeight } = window

    const bottomOfWindow = Math.round(scrollTop) + innerHeight >= offsetHeight - 100

    if (bottomOfWindow) {
      await this.clipService.getClips(this.randomMode)
    }
  }
}