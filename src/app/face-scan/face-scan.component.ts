import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';


@Component({
    selector: 'app-face-scan',
    templateUrl: './face-scan.component.html',
    styleUrls: ['./face-scan.component.css']
})
export class FaceScanComponent implements OnInit {

    @ViewChild('video')
    public video: ElementRef;

    @ViewChild('canvas')
    public canvas: ElementRef;

    public captures: Array<any>;

    public constructor() {
        this.captures = [];
    }
//    public webcamImage: WebcamImage = null;


    public ngOnInit() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                this.video.nativeElement.srcObject = stream;
                this.video.nativeElement.play();
            });
        }
    }


    public capture() {
        const context = this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 100, 100, 640, 480);
        this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));

        console.log(this.canvas.nativeElement.toDataURL('image/png'));
        const obj = {
            image: this.canvas.nativeElement.toDataURL('image/png')
        };
        console.log(obj);
    }

}
