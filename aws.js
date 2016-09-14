// Load the SDK
var AWS = require('aws-sdk');
var fs = require("fs");

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.aws_access_key_id;
AWS.config.secretAccessKey = process.env.aws_secret_access_key;
AWS.config.update({region: 'us-west-2'});

var dateFormat = require('dateformat');
var now = new Date();
var testkey = dateFormat(now, "mmddHHMMss");

var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-d732f0b7', // Ubuntu Server 14.04 LTS (HVM), SSD Volume Typ
  InstanceType: 't2.micro',
  MinCount: 1, MaxCount: 1,
  KeyName: 'aws_kp'
};


// Create the instance
ec2.runInstances(params, function(err, data)
{
  if (err)
  {
    console.log("Could not create instance", err);
    return;
  }
  // console.log(data);
  var instanceId = data.Instances[0].InstanceId;
  console.log("Created instance", instanceId);
  var params2 = {
    InstanceIds:[instanceId]
  };
  ec2.waitFor('instanceRunning', params2, function(err, data)
  {
    if (!err)
    { console.log("Please wait Running status checks on the instance");
    var ipAddress = data.Reservations[0].Instances[0].PublicIpAddress;
    ec2.waitFor('instanceStatusOk', params2, function(err, data)
    {
      if (!err)
      {
        // successful response
        console.log("System is OK and ready");
        // successful response
        console.log("Ip address of the instance", ipAddress);


        var inventory = "AWSInventory " + "ansible_ssh_host=" +ipAddress + " ansible_ssh_user=ubuntu" + " ansible_ssh_private_key_file=" + process.env.AWSSshKeyPath;
        console.log("Inventory file contents written: ",inventory);

        fs.writeFile('inventory',inventory);
        console.log("Append Complete");
      }
      else
      {
        console.log("System Checks failed");
        console.log(err, err.stack); // an error occurred
      }
    });
  }
  else
  {
    console.log("Problems starting instance");
    console.log(err, err.stack); // an error occurred
  }
});

// Add tags to the instance
params = {Resources: [instanceId], Tags: [
  {Key: 'Name', Value: 'ssangha-aws-'+testkey}
]};
ec2.createTags(params, function(err)
{
  console.log("Tagging instance", err ? "failure" : "success");
});
});
