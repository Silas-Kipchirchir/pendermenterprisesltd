export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();

    const response = await fetch("https://api.resend.com/emails", {
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

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (error) {

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  }
}
