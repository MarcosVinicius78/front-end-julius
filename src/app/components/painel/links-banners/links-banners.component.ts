import { LinkBannerService } from './../../../service/painel/link-banner.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { Banner } from 'src/app/models/banner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-links-banners',
  templateUrl: './links-banners.component.html',
  styleUrls: ['./links-banners.component.css']
})
export class LinksBannersComponent implements OnInit {

  linksFormGrupo!: FormGroup;
  bannerFomrGrupo!: FormGroup;

  modal = false;
  selectedFile: File | null = null;

  linksEBanners = new LinksBanner();

  banners: Banner[] = [];

  urlApi: string = environment.apiUrl;

  constructor(private formBuilder: FormBuilder,
              private linkBannerService: LinkBannerService
  ) { }

  ngOnInit(): void {

    this.listarLinksEBanners();

    this.linksFormGrupo = this.formBuilder.group({
      whatsapp: [''],
      telegram: [''],
      instagram: [],
      email: ['']
    });

    this.bannerFomrGrupo = this.formBuilder.group({
      nome: ['']
    })

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  salvarLinks() {
    const links = {
      whatsapp: this.linksFormGrupo.get(['whatsapp'])?.value,
      telegram: this.linksFormGrupo.get(['telegram'])?.value,
      instagram: this.linksFormGrupo.get(['instagram'])?.value,
      email: this.linksFormGrupo.get(['email'])?.value,
    };

    console.log(links);

    this.linkBannerService.salvarLinks(links).subscribe(response => {
      alert(response);
    })
  }

  listarLinksEBanners(){
    this.linkBannerService.listarLinksEBanners().subscribe(response => {
      this.linksEBanners = response;

      this.banners = response.banners

      console.log(response.banners[0].urlImagem)

      this.linksFormGrupo = this.formBuilder.group({
        whatsapp: this.linksEBanners.links[0].whatsapp,
        telegram: this.linksEBanners.links[0].telegram,
        instagram: this.linksEBanners.links[0].instagram,
        email: this.linksEBanners.links[0].email
      });
    })
  }

  fecharModal(){
    this.modal = false;
  }

  abrirModal(){
    this.modal = true;
  }

  impedirFechar(event: Event) {
    event.stopPropagation();
  }

  uploadImage() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('nome', this.bannerFomrGrupo.get(['nome'])?.value);

      this.linkBannerService.uploadImage(formData).subscribe(
        response => {
          console.log('Image uploaded successfully:', response);
          this.fecharModal()
          this.listarLinksEBanners()
        },
        error => {
          console.error('Error uploading image:', error);
          this.fecharModal()
          this.listarLinksEBanners()
        }
      );
    }
  }

  apagarBanner(id:number){
    this.linkBannerService.apagarBanner(id).subscribe(response => {
      this.listarLinksEBanners()
    });
  }
}
