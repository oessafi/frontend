import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './app.component';

// --- AJOUTS ---
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
// --- FIN DES AJOUTS ---

@NgModule({
  declarations: [
    AppComponent
    // Vos composants (comme LoginComponent) seront ajoutés ici par le CLI
  ],
  imports: [
    BrowserModule,
  RouterModule.forRoot(routes),
    // --- AJOUTS ---
    HttpClientModule,
    ReactiveFormsModule
    // --- FIN DES AJOUTS ---
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }