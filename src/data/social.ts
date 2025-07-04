export interface SocialLink {
  name: string
  url: string
  icon?: string
  username?: string
}

export const socialLinks: SocialLink[] = [
  {
    name: "Email",
    url: "mailto:fakritrk@gmail.com?subject=Hello%20Fakri!&body=Hi%20Fakri%2C%0A%0AI%20saw%20your%20portfolio%20and%20would%20like%20to%20connect%20with%20you%20about%20...",
  },
  {
    name: "GitHub",
    url: "https://github.com/FakriSouyo",
    username: "@fakhriabdillah",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/fakriab/",
    username: "fakhriabdillah",
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/user/31gcqkljbblx52dvsrpmzod3ez4m?si=qGgLfa3uQQeQrFJkK5n7Tw",
    username: "fakriee",
  },
]
