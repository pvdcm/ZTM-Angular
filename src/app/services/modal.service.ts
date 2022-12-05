import { Injectable } from '@angular/core';

interface Imodal{
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
   private modals: Imodal[] = []

   register(id:string){
    this.modals.push({
      id,
      visible:false
    })
   }

   unRegister(id: string){
    this.modals = this.modals.filter(
      element => element.id !== id
    )
   }

  constructor() { }

  isModalOpen(id:string) : boolean {
    return !!this.modals.find(element => element.id === id)?.visible
  }

  toggleModal(id: string){
    const modal = this.modals.find(element => element.id === id)

    if(modal){
      modal.visible = !modal.visible
    }
    
  }
}
