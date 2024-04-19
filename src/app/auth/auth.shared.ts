import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { NgOptimizedImage } from '@angular/common';
import { NormalizeSpacesDirective } from "../shared/directives/normalizeSpace.directive";

@NgModule({
    imports: [
        NgOptimizedImage,
        RouterLink,
        RouterLinkActive,
        NormalizeSpacesDirective
    ],
    exports: [
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        NgOptimizedImage,
        RouterLink,
        RouterLinkActive,
        NormalizeSpacesDirective
    ]
})
export class AuthShared { }