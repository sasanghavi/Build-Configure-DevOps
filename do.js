var needle = require("needle");
var os   = require("os");
var fs = require("fs");
var dateFormat = require('dateformat');
var now = new Date();
var testkey = dateFormat(now, "mmddHHMMss");
var config = {};
config.token = process.env.DigitalOceanToken;

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

// Documentation for needle:
// https://github.com/tomas/needle

var client =
{

	listRegions: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},

	listImages: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
	},

	listSshDetails: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/account/keys", {headers:headers}, onResponse)
	},

	createDroplet: function (dropletName, region, imageName, SshKeyId, onResponse)
	{
		var data =
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			// Fetched from listSshDetails id attribute and passed as array
			"ssh_keys":[SshKeyId],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null,
			"volumes":null
		};


		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );

	},
	retrieve: function(dropletId, onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse);
	}
};



// #############################################
// #1 Select the first of available regions
// https://developers.digitalocean.com/documentation/v2/#list-all-regions
console.log("\n__________________________________________________________");
console.log("Beginning tasks for DigitalOcean Droplet Creation");
console.log("\n__________________________________________________________");
client.listRegions(function(error, response)
{
	var data = response.body;
	if( data.regions )
	{
		console.log("Selecting the first available region");
		var region = data.regions[0].slug;
		console.log("Region Selected: ", region, "\n___________________________________________________________\n")
	}

	client.listImages(function(error, response)
	{
		var data = response.body;
		if( data.images )
		{
			for(var i=0; i<data.images.length; i++)
			{	var img = data.images[i].slug;
				if(img && (img.startsWith("deb")||img.startsWith("ubu")))
				{
					console.log("Selecting the first available debian/ubuntu image");
					var image = img;
					console.log("Image Selected: ", image, "\n___________________________________________________________\n");
					break;
				}
			}
		}

		client.listSshDetails(function(error, response)
		{
			var data = response.body;
			if( data.ssh_keys )
			{
				for(var i=0; i<data.ssh_keys.length; i++)
				{
					var sshid = data.ssh_keys[i].id;
					if(sshid)
					{
						console.log("Value of the ssh key id");
						var SshKeyId = sshid;
						console.log("SSH Key ID: ", SshKeyId, "\n___________________________________________________________\n");
						break;
					}
				}
			}

			var dropletName = "ssangha-digitalocean-"+testkey;
			client.createDroplet(dropletName, region, image, SshKeyId, function(error, response, body)
			{
				if(!error && response.statusCode == 202)
				{ var data = response.body;
					if(data)
					{
						var dropletId = data.droplet.id;
						console.log("Creating droplet");
						console.log("Droplet id is", dropletId);
						console.log("___________________________________________________________\n");
					}
				}
				else
				{

				}
				setTimeout(function ()
				{
					client.retrieve(dropletId, function(error, response)
					{
						var data = response.body;
						// console.log(data)
						if( data.droplet )
						{
							var ipAddress = data.droplet.networks.v4[0].ip_address;
							if ( ipAddress )
							{
								console.log("Droplet ip address is: ", ipAddress);
								console.log("___________________________________________________________\n");


								var inventory = "\nDigitalOceanInventory " + "ansible_ssh_host=" +ipAddress + " ansible_ssh_user=root" + " ansible_ssh_private_key_file=" + process.env.SshKeyPath;
								console.log("Inventory file contents ",inventory);

								fs.appendFile('inventory',inventory);
				        console.log("Inventory file contents added");
							}
						}
					})
				}, 3000)

			});

		});

	});

});
