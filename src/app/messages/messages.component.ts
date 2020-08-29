import { Component, OnInit } from '@angular/core';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(
    /*The messageService property MUST BE public because you're going to bind to it in the template.
    * Angular only binds to public component properties.*/
    public messageService : MessageService
  ) { }

  ngOnInit(): void {
  }

}
