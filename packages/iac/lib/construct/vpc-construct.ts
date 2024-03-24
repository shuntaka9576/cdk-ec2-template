import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class VpcConstruct extends Construct {
  public readonly myVpc: ec2.Vpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const myVpc = new ec2.Vpc(this, `${id}-VpcConstructVpc`, {
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    this.myVpc = myVpc;
  }
}
