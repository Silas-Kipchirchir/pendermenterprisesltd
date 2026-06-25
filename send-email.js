export async function onRequest(context) {

const { request, env } = context;

// Handle CORS

if (request.method === "OPTIONS") {

return new Response(null, {

headers: {

"Access-Control-Allow-Origin": "*",

"Access-Control-Allow-Methods": "POST, OPTIONS",

"Access-Control-Allow-Headers": "Content-Type"

}

});

}

if (request.method !== "POST") {

return new Response("Method Not Allowed", { status: 405 });

}

try {

const data = await request.json();

const resend = await fetch("https://api.resend.com/emails", {

method: "POST",

headers: {

Authorization: `Bearer ${env.RESEND_API_KEY}`,

"Content-Type": "application/json"

},

body: JSON.stringify({

from: "Penderm Enterprise <noreply@pendermenterprisesltd.co.ke>",

to: ["info@pendermenterprisesltd.co.ke"],

reply_to: data.email,

subject: `New Quote Request from ${data.name}`,

html: `

<h2>New Quote Request</h2>

<p><strong>Name:</strong> ${data.name}</p>

<p><strong>Email:</strong> ${data.email}</p>

<p><strong>Company:</strong> ${data.company}</p>

<p><strong>Project Details:</strong></p>

<p>${data.details}</p>

`

})

});

const result = await resend.json();

return new Response(JSON.stringify(result), {

status: resend.status,

headers: {

"Content-Type": "application/json",

"Access-Control-Allow-Origin": "*"

}

});

} catch (error) {

return new Response(JSON.stringify({

success: false,

error: error.message

}), {

status: 500,

headers: {

"Content-Type": "application/json",

"Access-Control-Allow-Origin": "*"

}

});

}

}
