import { Component, OnInit } from '@angular/core';
import { ChatController } from 'src/app/controllers/chatController';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
  constructor(private chatController: ChatController) {}

  ngOnInit(): void {
    this.response = 'Please ask a question about your data';
  }

  response = '';
  config = {
    title: 'Insight Ai',
  };

  setData(message: string) {
    console.log(` setting data ${message}`);
    this.response = message;
  }

  i = 0;
  async getMessage(message: any) {
    const response = await this.chatController.sendMessage(message);

    if (response === 'there was an error') {
      if (this.response === errorMessage1) {
        this.setData(errorMessage2);
      } else {
        this.setData(errorMessage1);
      }
      return;
    }

    if (PRINT_FULL_RESPONSE) {
      this.setData(JSON.stringify(response.message));
    } else {
      if (this.response === successMessage1) {
        this.setData(successMessage2);
      } else {
        this.setData(successMessage1);
      }
    }
  }
}

const errorMessage1 = 'Whoops, try again!';
const errorMessage2 = 'Hmmmmm, that confused me!';
const PRINT_FULL_RESPONSE = false;

const successMessage1 = 'Here you go!';
const successMessage2 = 'Take a look!';
