import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { User } from '../interfaces/User';
import { Observable } from '../../../../node_modules/rxjs';
import { tap } from '../../../../node_modules/rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = null;

  constructor(private http: HttpClient) {}

  public login(user: User): Observable<{token: string}> {
    return this.http.post<{token: string}>('/api/auth/login', user)
      .pipe(
        tap(({token}) => {
          localStorage.setItem('auth-token', token);
          this.setToken(token);
        })
      );
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user);
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.setToken(null);
    localStorage.clear();
  }
}
