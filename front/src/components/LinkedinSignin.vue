<script setup lang="ts">
const linkedinParameters: string = new URLSearchParams({
  response_type: "code",
  client_id: "78dvu4h0y2z2qz",
  redirect_uri: "http://localhost:5173",
  state: "qqergvzeV.HVBu_",
  scope: "r_emailaddress w_member_social r_liteprofile openid profile email",
}).toString();
const linkedinUrl: string = new URL("https://www.linkedin.com/oauth/v2/authorization?" + linkedinParameters).toString();
</script>

<template>
  <div class="container py-5 border-top">
    <div class="row text-center">
      <div class="col">
        <a class="btn btn-primary mx-2" :href="linkedinUrl" >
          Authorize Linkedin
        </a>
      </div>
    </div>
  </div>
</template>