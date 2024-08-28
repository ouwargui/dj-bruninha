import {type INode, Manager as MoonlinkManager} from 'moonlink.js';

export class Manager extends MoonlinkManager {
  constructor(sendPayload: (guildId: string, payload: string) => void) {
    super({
      nodes: [
        {
          identifier: 'node_1',
          host: 'http://localhost',
          port: 2333,
          secure: false,
        },
      ],
      options: {
        clientName: 'dj-bruninha',
      },
      sendPayload,
    });
  }

  public init(userId: string) {
    this.setupListeners();
    super.init(userId);
  }

  private setupListeners() {
    this.on('nodeCreate', (node) => this.onNodeCreate(node));
  }

  private onNodeCreate(node: INode) {
    console.log(`${node.host} is connected`);
  }
}
