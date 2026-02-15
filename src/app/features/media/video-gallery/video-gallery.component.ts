
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { VideoService } from '../../../core/services/video.service';
import { EmbeddedVideo } from '../../../models/misc.model';
import { SafePipe } from '../../../shared/pipes/safe.pipe';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [CommonModule, SafePipe, CardComponent, TranslateModule],
  templateUrl: './video-gallery.component.html',
  styles: []
})
export class VideoGalleryComponent implements OnInit {
  private videoService = inject(VideoService);

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
