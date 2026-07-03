import fetch from "node-fetch";

async function run() {
  const res = await fetch("http://localhost:3000/api/assets?keys=muallim_khairil_avatar,muallimah_ummi_avatar");
  const data = await res.json();
  console.log(data);
}
run();
