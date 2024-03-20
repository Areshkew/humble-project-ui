import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { NgOptimizedImage } from '@angular/common';

@NgModule({
    imports: [
        NgOptimizedImage,
        RouterLink,
        RouterLinkActive
    ],
    exports: [
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        NgOptimizedImage,
        RouterLink,
        RouterLinkActive
    ]
})
export class AuthShared { }