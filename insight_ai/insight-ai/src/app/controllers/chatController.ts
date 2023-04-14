import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { GraphModel } from '../model/graphModel';

@Injectable({
  providedIn: 'root',
})
export class ChatController {
  constructor(private http: HttpClient, private graphModel: GraphModel) {}
  private sendMessageUrl = `${environment.apiServerHost}/sendMessage`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  async sendMessage(message: string) {
    try {
      const request = { message };
      const response = this.http.post<SendMessageResonse>(
        this.sendMessageUrl,
        request,
        this.httpOptions
      );

      console.log('still waiting for answer');
      const answer = await firstValueFrom(response);
      console.log('got answer');

      this.graphModel.chartOptions.series = [
        {
          data: answer.data.series,
        },
      ];

      this.graphModel.chartOptions.xaxis = {
        categories: answer.data.categories,
      };
      return answer;
    } catch (error) {
      return 'there was an error';
    }
  }
}

interface SendMessageResonse {
  message: any[];
  data: { categories: string[]; series: number[] };
}
