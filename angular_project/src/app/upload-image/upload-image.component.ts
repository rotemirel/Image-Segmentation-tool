import { AnimateTimings } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component , ViewChild, ElementRef, Renderer2} from '@angular/core';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})

export class UploadImageComponent {

	url: any; 
	msg = "";
	selectedFile: any
	image: HTMLImageElement = new Image();
	
	canvas: any;
	ctx: any;
	isDrawing: boolean = false;
	startX: number = 0;
	startY: number = 0;
	lineIndices: number[][] =[];
	
	returnedImage_bytes : any
	imageUrl: any
	scale = 2

	counter = 0;
	counters: number[] = [];
	private lines: any[] = [];

	constructor(private http: HttpClient ,private elementRef: ElementRef, private renderer: Renderer2) {}

	// lifecycle hook, which is called after the view has been initialized.
	ngAfterViewInit() {
		this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
		this.ctx = this.canvas.getContext('2d');
	}

	// Triggered as a response to an image upload
	selectFile(event: any) { //Angular 11, for stricter type
		if(!event.target.files[0] || event.target.files[0].length == 0) {
			this.msg = 'You must select an image';
			return;
		}
		
		let file = event.target.files[0].type;
		if (file.match(/image\/*/) == null) {
			this.msg = "Only images are supported";
			return;
		}
		let reader = new FileReader();
		
		this.selectedFile = event.target.files[0];
		this.isDrawing = false;
		this.lineIndices = [];
		
		// Wait for the image to load
		reader.onload = (_event) => {
			var image = new Image();  
  			image.src = URL.createObjectURL(event.target.files[0]); 
			this.msg = "";
			this.url = reader.result; 
			image.onload = () => {  // Adjust the canvas size
				this.returnedImage_bytes = this.http.post('http://127.0.0.1:5000/data', this.selectedFile).subscribe(); 
				this.canvas.width = image.naturalWidth;  
				this.canvas.height = image.naturalHeight;
				this.lines=[];
				this.counters= [];
				this.counter = 0;
				if (this.ctx != null) {
					this.ctx.drawImage(image, 0, 0);
					this.image= image;	
					this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
					// this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
					this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
				}
			}
		}
		reader.readAsDataURL(event.target.files[0]);  //reads the file as a Data URL and triggers the onload event.
	}


	getData() {
		this.isDrawing = false;
		this.http.post('http://127.0.0.1:5000/indices', this.lineIndices)  // Sending to server the new indices
		.subscribe(imageData => {
			this.counters.push(this.counter);
			this.counter = 0;
			this.lineIndices =[];
			console.log(imageData); 
			this.show_new_image(imageData)
		});
	}


	show_new_image(response: { [x: string]: any; } ) {
		const imageBase64 = response['image'];
		const imageBytes = atob(imageBase64);
		const imageArray = new Uint8Array(imageBytes.length);
		for (let i = 0; i < imageBytes.length; i++) {
		  imageArray[i] = imageBytes.charCodeAt(i);
		}

		const imageBlob = new Blob([imageArray], {type: 'image/jpeg'});
		
		var reader = new FileReader();
		reader.readAsDataURL(imageBlob);
		
		reader.onload = (_event) => {
			this.msg = "";
			this.imageUrl = reader.result; 
			// this.selectedFile = this.imageUrl
		}	
	}


	calculateLinePixels(currX: number, currY: number) {
		const dx = Math.abs(currX - this.startX);
		const dy = Math.abs(currY - this.startY);
		const sx = (this.startX < currX) ? 1 : -1;
		const sy = (this.startY < currY) ? 1 : -1;
		let err = dx - dy;
	
		while (true) {
			this.lineIndices.push([this.startX, this.startY]);
			if (this.startX === currX && this.startY === currY) {
				break;
			}
			const e2 = 2 * err;
			if (e2 > -dy) {
				err -= dy;
				this.startX += sx;
			}
			if (e2 < dx) {
				err += dx;
				this.startY += sy;
			}
		}
	  }

	onMouseDown(event: MouseEvent) {
		const currX = event.offsetX
		const currY = event.offsetY
		if(this.isDrawing) {
			this.ctx.lineWidth = 2.5;
			this.ctx.strokeStyle = "darkblue";
			this.ctx.moveTo(this.startX, this.startY);
		  	this.ctx.lineTo(currX, currY);
			this.ctx.stroke();
			this.counter +=1;
			this.lines.push({
				startX: this.startX,
				startY: this.startY,
				endX: currX,
				endY: currY,
				lineWidth: 5,
				strokeStyle: "blue"
			});
			this.calculateLinePixels(currX, currY);
		}		
		this.startX = currX;
		this.startY = currY;
		this.isDrawing = true;
	}

	onMouseUp(event: MouseEvent) {
		// this.isDrawing = false;
	}

	zoomIn() {
		this.scale += 0.1;
	}
	
	zoomOut() {
	this.scale -= 0.1;
	}

	undo(){
		this.http.get('http://127.0.0.1:5000/undo').
		subscribe(imageData => {
			console.log(imageData); 
			this.show_new_image(imageData)

			if (this.lines.length === 0 || this.counters.length==0) {
				return;
			}
			else{
				let curr_counter = this.counters.pop()
				if (curr_counter != undefined){
					for (let i = 0 ; i< curr_counter; i+=1)
						this.lines.pop();
				}				
			}
			this.ctx = this.canvas.getContext('2d');
			this.ctx.drawImage(this.image, 0, 0);
			this.lines.forEach((line) => {
				this.ctx.lineWidth = 2.5;
				this.ctx.strokeStyle = "darkblue";
				this.ctx.beginPath();
				this.ctx.moveTo(line.startX, line.startY);
				this.ctx.lineTo(line.endX, line.endY);
				this.ctx.stroke();
			});
			this.isDrawing = false;
		});
	}


}

