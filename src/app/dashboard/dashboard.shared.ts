import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { NgOptimizedImage } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { IconComponent } from "../shared/icon/icon.component";
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { NormalizeSpacesDirective } from "../shared/directives/normalizeSpace.directive";

@NgModule({
    imports: [
        NgOptimizedImage,
        RouterLink,
        RouterLinkActive,
        FormsModule,
        IconComponent,
        NormalizeSpacesDirective
    ],
    exports: [
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        NgOptimizedImage,
        RouterLink,
        RouterLinkActive,
        TableModule,
        ButtonModule,
        FormsModule,
        BreadcrumbModule,
        IconComponent,
        ConfirmPopupModule,
        DynamicDialogModule,
        NormalizeSpacesDirective
    ],
})
export class DashboardShared { }