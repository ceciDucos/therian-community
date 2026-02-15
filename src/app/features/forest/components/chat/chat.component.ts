import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Toolbar (Club Penguin / Pony Town style) -->
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50 pointer-events-auto">
      
      <!-- Chat Input Bar -->
      <div class="bg-black/80 backdrop-blur-md border-[3px] border-white/20 rounded-full pl-4 pr-1 py-1 flex items-center gap-2 shadow-2xl transition-all hover:border-white/40 w-[600px]">
        
        <!-- Icon -->
        <span class="text-xl">💬</span>
        
        <input 
          #chatInput
          type="text" 
          [(ngModel)]="newMessage" 
          (keydown)="stopProp($event)"
          (keyup)="stopProp($event)"
          (keydown.enter)="sendMessage()"
          placeholder="Di algo..."
          class="flex-1 bg-transparent text-white font-medium placeholder:text-white/50 focus:outline-none"
        />

        <button 
          (click)="sendMessage()"
          class="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full transition-colors flex items-center justify-center h-10 w-10 shrink-0"
          [disabled]="!newMessage.trim()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </div>

      <!-- Action Buttons (Placeholders) -->
      <div class="flex gap-2 ml-2">
        <button class="bg-black/80 border-[3px] border-white/20 text-white w-12 h-12 rounded-full hover:bg-white/20 hover:scale-110 transition-all flex items-center justify-center text-xl shadow-xl" title="Emotes">
          😊
        </button>
        <button class="bg-black/80 border-[3px] border-white/20 text-white w-12 h-12 rounded-full hover:bg-white/20 hover:scale-110 transition-all flex items-center justify-center text-xl shadow-xl" title="Actions">
          💃
        </button>
      </div>

    </div>
  `,
  styles: []
})
export class ChatComponent implements OnInit {
  private socketService = inject(SocketService);
  newMessage = '';

  @ViewChild('chatInput') chatInput!: ElementRef;

  ngOnInit() { }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.socketService.sendMessage(this.newMessage);
    this.newMessage = '';

    // Blur input to return focus to game
    this.chatInput?.nativeElement?.blur();
  }

  stopProp(event: Event) {
    event.stopPropagation();
  }
}
