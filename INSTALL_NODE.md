# Install Node.js

It looks like **Node.js** is not installed on your computer. This software is required to run modern web applications like the one we built.

## How to Install

1.  **Download**:
    *   Go to the official website: [https://nodejs.org/](https://nodejs.org/)
    *   Download the **LTS (Long Term Support)** version (Recommended for most users).

2.  **Install**:
    *   Run the downloaded installer (`.msi` file).
    *   Follow the installation prompts. **Important**: Make sure the option **"Add to PATH"** is checked (it usually is by default).

3.  **Verify**:
    *   After installation, **close your current terminal/PowerShell window** and open a new one.
    *   Run the following command to check if it worked:
        ```powershell
        node -v
        npm -v
        ```
    *   You should see version numbers printed out (e.g., `v20.11.0`).

## After Installing Node.js

Once Node.js is installed, go back to your project folder and run the commands:

```powershell
cd budget-tracker
npm install
npx prisma generate
npx prisma db push
npm run dev
```
