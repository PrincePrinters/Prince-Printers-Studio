# Studio Website Template

Wedding photography & cinematography studio website — Next.js 16.
Created by [Quick Art Photography Academy](https://quickartphotography.in/).

## Apni website kaise banayein

1. **[MASTER_PROMPT.txt](MASTER_PROMPT.txt)** kholiye — apni details bhariye aur AI tool (Antigravity / Claude Code / Cursor) ko dijiye.
2. Website live karne ke poore steps: **[STUDIO_SETUP_PROMPT.md](STUDIO_SETUP_PROMPT.md)**
3. Studio ki saari details ek hi file mein hain: `src/config/studio.ts`

## Features

- Event code / QR se guest gallery — photo & video download
- Selfie se apni photos dhoondhna (AI face search, browser mein)
- Admin panel: photos/videos upload, guest QR code, leads CRM
- Blog (`content/blog/` mein Markdown files)
- Mobile responsive

## Local par chalaiye

```bash
npm install
npm run dev
```

Phir http://localhost:3000 kholiye. Admin: http://localhost:3000/admin (local PIN `2026`; live site par `ADMIN_PIN` set kariye).

## License

[LICENSE](LICENSE) dekhiye. Footer ka "Created by Quick Art Photography Academy" credit hatana mana hai.
