# Editing the site

All the words and images on the site are edited in the admin at
**<https://thegildastudios.netlify.app/keystatic>** (on the live domain once it moves, #33). You don’t
need to touch any code.

Every change goes through three steps: **start a branch, save, publish.** A branch is a private copy of
the site. You can save as often as you like there and look at the result, and nothing goes live until
you publish it.

## Sign in

1. Open `/keystatic` and choose **Sign in with GitHub**. Use your own GitHub account. It needs access to
   the `thegildastudios` repository (Chris sets this up once, see the end of this page).
2. The first time, GitHub asks you to authorise the **The Gilda Studios** app. Accept.

## 1. Start a branch

1. Click the branch name at the top left (it says **main**) and choose **New branch**.
2. Give it a short name in lower case with dashes, such as `spring-update`. The admin adds `content-` in
   front, so the branch is `content-spring-update`.

The live site is protected, so saving straight onto **main** won’t work. Always start a branch first.
You can reuse one branch for a whole batch of changes.

## 2. Edit and save

The menu on the left follows the site:

- **Pages**: the copy on each page: Homepage, About, Services, Projects, Case study pages (the labels every
  case study shares) and Contact.
- **Content**: Case studies, Testimonials, Services and Team. These are lists you can add to.
- **Site**: Site settings (navigation, booking button, email and phone, footer, studio name and shared
  labels), the line for each branch on the homepage, and the Page not found and Message sent pages.

Change what you need and press **Save**. Each field says what it’s for. A red star means the field
can’t be left empty, and the admin won’t save until those are filled in.

Page titles and search descriptions are in **Page title and description** on each page and case
study. Defaults, the live site address and approved public business details are in
**Site settings → Search and social previews**. See [Search and social previews](seo.md) before
changing the site address or adding address and phone details.

A few house rules the admin can’t check for you:

- Headlines are in sentence case and usually end with a full stop. No exclamation marks, no emoji.
- Fields that say **Shown in capitals** are typed in capitals.
- Use the curly apostrophe (’) the rest of the site uses.
- `{n}`, `{shown}`, `{total}`, `{service}` and similar are filled in by the site. Keep them as they are.

Branch names, numbers, colours and their order (Plan, Build, Grow) are fixed in the design and can’t be
changed here.

## Add a case study

1. **Content → Case studies → Add.**
2. Fill in the project name. The **Web address** fills itself in from the name: the page will be
   `/projects/<web-address>/`. Choose it carefully, because changing it later breaks links to the page.
3. Set the **Position** (1 comes first on the Projects page), tick the **Branches** that worked on it and
   fill in the sector line, the card line, the summary and the four **Facts**.
4. Add the **Card image** and the **Main image**. The main image needs **alt text**: one plain sentence
   saying what the photo shows, for people who can’t see it. Add up to three **Gallery** images the same
   way.
5. Under **Sections**, add each section of the story with **Add**. Inside a section, **Add** offers
   paragraphs, numbered lists, callouts, highlight panels, a testimonial, groups of items and branch
   cards. Tick **Highlight this section** for the outcome.
6. Press **Create**.

To quote the client, first add them under **Content → Testimonials** with this project as its
**Project**, then add a **Testimonial** block to the case study. Give the testimonial a **Position on the
homepage** to show it in the homepage rotator too.

The new project appears on the Projects page, in its count and filters, and in the **Next project** links
at the end of each case study. Tick **Show on the homepage** to add it to Selected work.

To hide a project for a while, tick **Draft**. To edit one, open it, change it and save.

## Remove a case study

Open it and use the bin icon at the top right, then confirm. It disappears from the Projects page, the
count, the filters and the Next project loop, and its images are deleted with it. If a testimonial on the
homepage points to it, choose another project for that testimonial first, or the site won’t build.

## Images

Upload JPG or PNG photos at their full size. The site makes smaller copies for phones and fast loading,
so there’s no need to resize them. Keep each file under 10 MB. Uploaded images are stored with the entry
they belong to.

## 3. Preview on your branch

A minute or two after you save, your branch has its own copy of the site at:

`https://content-<your-branch>--thegildastudios.netlify.app`

The open-in-new-tab icon at the top right of a page or case study takes you straight to it. If it still
shows the old version, wait a minute and reload: each save rebuilds the preview.

## 4. Publish

1. Click the branch name at the top left and choose **Create pull request**. GitHub opens.
2. Write one line about what changed and choose **Create pull request**.
3. Wait for the checks at the bottom to turn green (a few minutes). If one fails, the details say which
   entry and field to fix. Fix it in the admin on the same branch and save.
4. Choose **Merge pull request**, then **Confirm**. The live site updates a few minutes later.

Open the pull request when you’re ready to publish, not before: once it’s open, every save builds a
preview twice. Afterwards, start a new branch for the next round of changes.

---

## One-time setup (Chris)

These steps connect the admin to GitHub. They need the repository owner’s accounts.

1. **Create the GitHub App.** In a local checkout run `PUBLIC_KEYSTATIC_STORAGE=github npm run dev`,
   open <http://127.0.0.1:4321/keystatic> and follow **Create GitHub App**. Name it _The Gilda Studios_,
   create it on the account that owns the repository and install it on `thegildastudios` only.
   Keystatic writes the four values below into a local `.env` file. Never commit it.
2. **Add the production callback.** In the app’s settings on GitHub, add the callback URL
   `https://thegildastudios.netlify.app/api/keystatic/github/oauth/callback` (and the same path on
   `www.thegildastudios.com` once #33 connects it).
3. **Add the Netlify environment variables** (Project configuration → Environment variables), for all
   deploy contexts:
   - `KEYSTATIC_GITHUB_CLIENT_ID` and `KEYSTATIC_GITHUB_CLIENT_SECRET`: marked as secret, scope
     **Functions**.
   - `KEYSTATIC_SECRET`: marked as secret, scope **Functions**.
   - `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`: scope **Builds**. It’s read when the site builds.

   Then redeploy production.

4. **Give access.** Invite Maronia to the repository as a collaborator with **Write** access, and make
   sure the app is installed for the repository. Chris already has access as the owner.
5. **Branch deploys** are already on for all branches. `scripts/netlify-ignore.sh` builds only the
   `content-*` ones, so the agents’ branches don’t build twice.

To edit locally without GitHub, run `npm run dev` and open <http://127.0.0.1:4321/keystatic>: changes
are written straight to the files in your checkout.
