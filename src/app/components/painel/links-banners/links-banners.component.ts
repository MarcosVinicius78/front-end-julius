import { LinkBannerService } from './../../../service/painel/link-banner.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { Banner } from 'src/app/models/banner';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-links-banners',
  templateUrl: './links-banners.component.html',
  styleUrls: ['./links-banners.component.scss'],
  providers: [MessageService]
})
export class LinksBannersComponent implements OnInit {

  linksFormGrupo!: FormGroup;
  bannerFomrGrupo!: FormGroup;

  modal = false;
  selectedFile: File | null = null;
  fileMobile: File | null = null;

  linksEBanners = new LinksBanner();

  banners: Banner[] = [];

  idEditar: number = 0

  urlApi: string = environment.apiUrl;

  constructor(
    private formBuilder: FormBuilder,
    private linkBannerService: LinkBannerService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.listarLinksEBanners();

    if (this.linksEBanners.links == undefined) {
      this.linksFormGrupo = this.formBuilder.group({
        whatsapp: [''],
        telegram: [''],
        instagram: [],
        email: ['']
      });
    }


    this.bannerFomrGrupo = this.formBuilder.group({
      nome: [''],
      link: ['']
    })

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onFileSelectedMobile(event: any) {
    this.fileMobile = event.target.files[0];
  }

  salvarLinks() {

    let links = {};

    if (!this.linksEBanners.links || !this.linksEBanners.links || this.linksEBanners.links.id === undefined) {
      links = {
        whatsapp: this.linksFormGrupo.get(['whatsapp'])?.value,
        telegram: this.linksFormGrupo.get(['telegram'])?.value,
        instagram: this.linksFormGrupo.get(['instagram'])?.value,
        email: this.linksFormGrupo.get(['email'])?.value,
        siteId: environment.site
      };
    } else {
      links = {
        id: this.linksEBanners.links.id,
        whatsapp: this.linksFormGrupo.get(['whatsapp'])?.value,
        telegram: this.linksFormGrupo.get(['telegram'])?.value,
        instagram: this.linksFormGrupo.get(['instagram'])?.value,
        email: this.linksFormGrupo.get(['email'])?.value,
        siteId: environment.site
      };
    }

    this.linkBannerService.salvarLinks(links).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'Salvo' });
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Salvar' });
    })
  }

  listarLinksEBanners() {
    this.linkBannerService.listarLinksEBanners().then(response => {
      this.linksEBanners = response;

      this.banners = response.banners

      if (this.linksEBanners.links != undefined) {
        this.linksFormGrupo = this.formBuilder.group({
          whatsapp: this.linksEBanners.links.whatsapp,
          telegram: this.linksEBanners.links.telegram,
          instagram: this.linksEBanners.links.instagram,
          email: this.linksEBanners.links.email
        });
      }
    })
  }

  fecharModal() {
    this.modal = false;
  }

  abrirModal(id: number, nome: string, link: string) {
    if (id !== 0) {
      this.bannerFomrGrupo = this.formBuilder.group({
        nome: [nome],
        link: [link]
      })
    }

    this.idEditar = id
    this.modal = true;
  }

  impedirFechar(event: Event) {
    event.stopPropagation();
  }

  uploadImage() {
    if (this.selectedFile && this.fileMobile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('fileMobile', this.fileMobile);
      formData.append('nome', this.bannerFomrGrupo.get(['nome'])?.value);
      formData.append('link', this.bannerFomrGrupo.get(['link'])?.value);

      this.linkBannerService.uploadImage(formData).subscribe(
        response => {
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

  apagarBanner(id: number) {
    this.linkBannerService.apagarBanner(id).subscribe(response => {
      this.listarLinksEBanners();
    });
  }

  editarBanner(id: number) {

    const nome = this.bannerFomrGrupo.get('nome')?.value
    const link = this.bannerFomrGrupo.get('link')?.value

    this.linkBannerService.editarBanner(id, this.selectedFile, this.fileMobile, nome, link).subscribe(response => {
      // alert('Banner editado com sucesso');
    });
    this.listarLinksEBanners();
    this.modal = false;
  }
}
