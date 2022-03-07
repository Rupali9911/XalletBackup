import React, {Component} from 'react';
import io from 'socket.io-client';
import { Events } from '../App';
// import {eventService} from '../utils';

export default class SingleSocket extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.webSocketBridge;
    this.jwt;
    this.userId;
    this.subject;
    this.socketChecker;
  }

  static myInstance = null;

  static getInstance() {
    if (SingleSocket.myInstance == null) {
      SingleSocket.myInstance = new SingleSocket();
    }

    return this.myInstance;
  }

  async create({...config}) {
    this.connectSocket();
  }

  async connectSocket(onOpen,onClose) {
    return new Promise((resolve,reject) => {
      console.log('webSocketBridge', this.webSocketBridge);
      this.webSocketBridge = new WebSocket(
        `ws://54.255.221.170:9898/`,
      );
      this.webSocketBridge.onopen = (e) => {
        console.log('socket opened');
        onOpen && onOpen();
        resolve();
      };
      this.webSocketBridge.onmessage = (e) => {
        this.onNewMessage(e);
      };
      this.webSocketBridge.onerror = (e) => {
        console.log('Socket error', e);
      };
      this.webSocketBridge.onclose = (e) => {
        console.log('socket closed');
        onClose && onClose();
      }
    });
  }

  onNewMessage(e) {
    //console.log('socket_new_message',e);
    // eventService.sendMessage(JSON.parse(e.data));
    Events.next(e.data);
  }

  onSendMessage = (data) => {
    if (this.webSocketBridge !== null) {
      this.webSocketBridge.send(
        JSON.stringify(data),
      );
    }
  }

  closeConnection = () => {
    if (this.webSocketBridge !== null) {
      this.webSocketBridge.close();
    }
  }

  render(){
    return null;
  }
}
