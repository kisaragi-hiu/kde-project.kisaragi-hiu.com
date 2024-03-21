import { Router } from "itty-router"

const router = Router();

router.get('/:project', ({params}) => {
  const input = decodeURIComponent(params.text)
  fetch("https://projects.kde.org/api/v1/identifier/websites-hugo-kde").json().repo
  // TODO validate
})

router.all("*", () => new Response("Not found", {status: 404}))

export default router
