import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as RecordRTC from 'recordrtc';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserRegisterService } from '../shared/services/user-register.service';
import { IResponse } from '../shared/models/single-word-response.model';
import { getSentence } from '../shared/getSentence';
import { UserLoginService } from '../shared/services/user-login.service';
import { NavBarService } from '../shared/services/navbarservice';

@Component({
  selector: 'app-voice-login',
  templateUrl: './voice-login.component.html',
  styleUrls: ['./voice-login.component.css']
})
export class VoiceLoginComponent implements OnInit {
  static str: string;
  sentence: string;
  // @ViewChild('video')
  // public video: ElementRef;

  // @ViewChild('audio')
  // public audio: ElementRef;

  // blob: Blob;
  private record;
  public recording = false;
  public url;
  private error;
  constructor(
    private domSanitizer: DomSanitizer,
    private router: Router,
    private userService: UserService,
    private userLoginService: UserLoginService,
    private http: HttpClient,
    private navBarService: NavBarService) { }

  ngOnInit() {
    // this.navBarService.hide();
    this.sentence = getSentence() + ' ' + getSentence();
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  initiateRecording() {

    this.recording = true;
    const mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
  /**
   * Will be called automatically.
   */
  successCallback(stream: MediaStream) {
    const options = {
      mimeType: 'audio/wav',
      type: 'audio',
      recorderType: 'StereoAudioRecorder',
      numberOfAudioChannels: 1
    };

    const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }
  /**
   * Stop recording.
   */
  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
    console.log(this);
  }

  async processRecording(blob: Blob) {

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const abcd = reader.result;
      console.log(abcd);
      VoiceLoginComponent.str = abcd.toString();
      console.log(VoiceLoginComponent.str);
      this.postData();
    };

  }

  postData() {

    const audio = VoiceLoginComponent.str;
    const localStorageTokens = JSON.parse(localStorage.getItem('TigerAuth'));
    this.userLoginService.sendVoice(audio, localStorageTokens, this.sentence).subscribe(
      (res: { message: string, TigerAuth: any }) => {
        if (res.message === 'valid') {
          localStorage.setItem('TigerAuth', JSON.stringify(res.TigerAuth));
          this.router.navigate(['/otp-login']);

        } else {
          alert('Please try again');
        }

        // this.userLoginService.redirectUserAsPerAuthentication();
      });
      // this.router.navigate(['/otp-login']);

  }

  /**
   * Process Error.
   */
  errorCallback(error) {
    this.error = 'Can not play audio in your browser';
  }

}
