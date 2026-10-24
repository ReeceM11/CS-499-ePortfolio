import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  private apiBaseUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  public getToken(): string {
    const token = this.storage.getItem('travlr-token');

    if (!token) {
      return '';
    }

    return token;
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return payload.exp > (Date.now() / 1000);
    }

    return false;
  }

  public getCurrentUser(): User {
    const token = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));

    return { email, name } as User;
  }

  public login(user: User, password: string): Observable<AuthResponse> {
    return this.handleAuthApiCall('login', user, password);
  }

  public register(user: User, password: string): Observable<AuthResponse> {
    return this.handleAuthApiCall('register', user, password);
  }

  private handleAuthApiCall(
    endpoint: string,
    user: User,
    password: string
  ): Observable<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: password
    };

    return this.http
      .post<AuthResponse>(`${this.apiBaseUrl}/${endpoint}`, formData)
      .pipe(
        tap((response: AuthResponse) => {
          this.saveToken(response.token);
        })
      );
  }
}