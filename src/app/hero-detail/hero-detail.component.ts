import {Component, Input, OnInit} from '@angular/core';
import {Hero} from '../hero';
import {ActivatedRoute} from '@angular/router';
import {HeroService} from '../hero.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero : Hero;

  constructor(
    private route: ActivatedRoute, // The ActivatedRoute holds information about the route to this instance of the HeroDetailComponent. This component is interested in the route's parameters extracted from the URL. The "id" parameter is the id of the hero to display.
    private heroService: HeroService, // The HeroService gets hero data from the remote server and this component will use it to get the hero-to-display.
    private location: Location //The location is an Angular service for interacting with the browser. We'll use it later to navigate back to the view that navigated here.

  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    /*
    Extract the id route parameter.
    * Route parameters are always strings.
    * The JavaScript (+) operator converts the string to a number, which is what a hero id should be.
    * */
    const id = +this.route.snapshot.paramMap.get('id'); //https://angular.io/tutorial/toh-pt5#extract-the-id-route-parameter

    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }
}
