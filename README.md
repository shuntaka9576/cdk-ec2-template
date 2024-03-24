# cdk-ec2-template

Wrote a CDK for those times when you just want to dabble in Linux. It's a minimal setup with a public subnet + inbound SSH access restricted to your IP.


## Quick Start(5m)

create stack.
```bash
$ pnpm install
$ cd ./packages/iac
$ npx cdk deploy
...

 ✅  ec2-template

✨  Deployment time: 184.47s

Outputs:
ec2-template.ec2templateTemplateEC2Output =
aws ssm get-parameter --with-decryption --name /ec2/keypair/key-hoge --query "Parameter.Value" --output text> ec2-template.pem && chmod 400 ec2-template.pem;
ssh -i ec2-template.pem ec2-user@ip;
```

exec cfn outputs command.

```
$ aws ssm get-parameter --with-decryption --name /ec2/keypair/key-hoge --query "Parameter.Value" --output text> ec2-template.pem && chmod 400 ec2-template.pem;
ssh -i ec2-template.pem ec2-user@ip;

The authenticity of host 'ip (ip)' can't be established.
ED25519 key fingerprint is SHA256:hoge
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'ip' (ED25519) to the list of known hosts.
   ,     #_
   ~\_  ####_        Amazon Linux 2
  ~~  \_#####\
  ~~     \###|       AL2 End of Life is 2025-06-30.
  ~~       \#/ ___
   ~~       V~' '->
    ~~~         /    A newer version of Amazon Linux is available!
      ~~._.   _/
         _/ _/       Amazon Linux 2023, GA and supported until 2028-03-15.
       _/m/'           https://aws.amazon.com/linux/amazon-linux-2023/

7 package(s) needed for security, out of 12 available
Run "sudo yum update" to apply all updates.
```
