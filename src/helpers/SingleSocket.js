import React, { Component } from 'react';
import io from 'socket.io-client';
import { Events } from '../App';
// import {eventService} from '../utils';

export default class SingleSocket extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.webSocketBridge;
  }

  static myInstance = null;

  static getInstance() {
    if (SingleSocket.myInstance == null) {
      SingleSocket.myInstance = new SingleSocket();
    }

    return this.myInstance;
  }

  async create({ ...config }) {
    this.connectSocket();
  }

  async connectSocket(onOpen, onClose) {
    return new Promise((resolve, reject) => {
      this.webSocketBridge = new WebSocket(
        `ws://54.255.221.170:9898/`,
      );
      this.webSocketBridge.onopen = (e) => {
        onOpen && onOpen();
        resolve();
      };
      this.webSocketBridge.onmessage = (e) => {
        this.onNewMessage(e);
      };
      this.webSocketBridge.onerror = (e) => {
      };
      this.webSocketBridge.onclose = (e) => {
        onClose && onClose();
      }
    });
  }

  onNewMessage(e) {
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

  render() {
    return null;
  }
}
