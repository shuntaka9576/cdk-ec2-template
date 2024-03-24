import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { VpcConstruct } from './construct/vpc-construct';
import { aws_ec2, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import publicIp from 'public-ip';

interface Props {
  keyPairName: string;
  pemName: string;
}

export class EC2TemplateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const vpc = new VpcConstruct(this, `${id}-TemplateEC2VpcConstruct`);
    const securityGroupForEc2 = new aws_ec2.SecurityGroup(
      this,
      `${id}-templateEC2`,
      {
        vpc: vpc.myVpc,
        allowAllOutbound: true,
      }
    );

    publicIp
      .v4()
      .then((ipAddress) =>
        securityGroupForEc2.addIngressRule(
          aws_ec2.Peer.ipv4(`${ipAddress}/32`),
          aws_ec2.Port.tcp(22)
        )
      );

    const keyPair = new aws_ec2.KeyPair(this, `${id}-TemplateEC2KeyPair`, {
      keyPairName: props.keyPairName,
    });
    keyPair.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const instance = new aws_ec2.Instance(this, `${id}-TemplateEC2Instance`, {
      vpc: vpc.myVpc,
      securityGroup: securityGroupForEc2,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      instanceType: aws_ec2.InstanceType.of(
        aws_ec2.InstanceClass.T3,
        aws_ec2.InstanceSize.MEDIUM
      ),
      machineImage: new aws_ec2.AmazonLinuxImage({
        generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyPair: keyPair,
    });

    new CfnOutput(this, `${id}-TemplateEC2Output`, {
      value: `
aws ssm get-parameter --with-decryption --name /ec2/keypair/${keyPair.keyPairId} --query "Parameter.Value" --output text> ${props.pemName} && chmod 400 ${props.pemName};
ssh -i ${props.pemName} ec2-user@${instance.instancePublicIp};
`,
    });
  }
}
