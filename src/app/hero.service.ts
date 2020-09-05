import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import {MessageService} from './message.service'; // reason: https://angular.io/tutorial/toh-pt4#observable-data
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private baseUrl = 'http://localhost:8080/api/';  // base URL to web apis(backend server)
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    /*
  This is a typical "service-in-service" scenario:
  you inject the MessageService into the HeroService which is injected into the HeroesComponent.
*/
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
    this.log('fetched heroes');

    // reason: https://angular.io/tutorial/toh-pt4#observable-heroservice
   // return of(HEROES);

    //returns an Observable<Hero[]> that emits a single value, an array of heroes from  mock heroes.
    // In real app, instead 'of' method  we'll call HttpClient.get<Hero[]>() which also returns
    // an Observable<Hero[]> that emits a single value, an array of heroes from the body of the HTTP response.

    //All HttpClient methods return an RxJS Observable of something.
    //HttpClient.get() returns the body of the response as an untyped JSON object by default.
    // Applying the optional type specifier, <Hero[]> , adds TypeScript capabilities,
    // which reduce errors during compile time.

    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)
      .pipe(
        tap(_ => this.log('fetched heroes')), //todo: ne kontam potrebu tap() operatora
        catchError(this.handleError<Hero[]>('getHeroes', [])) //https://angular.io/tutorial/toh-pt6#error-handling
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    // TODO: send the message _after_ fetching the hero
    this.log(`fetched hero id=${id}`); //backticks ( ` ) that define a JavaScript template literal for embedding the id.
    //return of(HEROES.find(hero => hero.id === id));
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`, ))
      );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {

    this.log(`Update hero id=${hero.id}`);
    return this.http.put(`${this.baseUrl}/heroes`, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    //Method expects the server to generate id for the new hero, which it returns in the Observable<Hero> to the caller.
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.baseUrl}/heroes/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Handle Http operation that failed. //https://angular.io/tutorial/toh-pt6#handleerror
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      //Because each service method returns a different kind of Observable result, handleError() takes a
      // type parameter so it can return the safe value as the type that the app expects.

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead. Ovo se mora uraditi inace ce u conzoli da ispisuje error kao da ga nismo hendlali

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
