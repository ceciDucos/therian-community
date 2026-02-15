
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../core/services/video.service';
import { I18nService } from '../../../core/services/i18n.service';
import { EmbeddedVideo } from '../../../models/misc.model';
import { SafePipe } from '../../../shared/pipes/safe.pipe';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [CommonModule, SafePipe, CardComponent, TranslatePipe],
  templateUrl: './video-gallery.component.html',
  styles: []
})
export class VideoGalleryComponent implements OnInit {
  private videoService = inject(VideoService);
  i18n = inject(I18nService);

  videos = signal<EmbeddedVideo[]>([]);
  loading = signal(true);

  async ngOnInit() {
    await this.loadVideos();
  }

  async loadVideos() {
    this.loading.set(true);
    const { data } = await this.videoService.getVideos();
    if (data) {
      this.videos.set(data);
    }
    this.loading.set(false);
  }
}
