import * as cdk from 'aws-cdk-lib';
import { EC2TemplateStack } from '../lib/infra-stack';

const app = new cdk.App();

new EC2TemplateStack(app, 'ec2-template', {
  keyPairName: 'ec2-template',
  pemName: 'ec2-template.pem',
});
