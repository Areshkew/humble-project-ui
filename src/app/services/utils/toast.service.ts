import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private TOAST_KEY: string = 'global-toast';
  private STICKY: boolean = false;

  constructor(private messageService: MessageService) { }

  async showSuccessToast(summary:string,
    detail:string): Promise<void> { this.showToast(summary,detail,'success');
  }

  async showInfoToast(summary:string,detail:string): Promise<void> { 
    this.showToast(summary,detail,'info');
  }

  async showWarnToast(summary:string, detail:string): Promise<void> {
    this.showToast(summary,detail,'warn');
  }

  async showErrorToast(summary:string, detail:string): Promise<void> {
    this.showToast(summary,detail,'error');
  }

  private async showToast(summary:string, detail:string, severity:string): Promise<void> {
    this.messageService.clear();
    
    this.messageService.add({
      key:this.TOAST_KEY, 
      severity: severity, 
      life: 3500,
      summary: summary,
      detail: detail, 
      sticky: this.STICKY });
  }
}
