<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap | Aira Paints</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          :root {
            --brand-green: #0F4D3A;
            --brand-green-light: #166850;
            --brand-gold: #D4AF37;
            --bg-dark: #0a100d;
            --bg-card: rgba(255, 255, 255, 0.04);
            --border-color: rgba(255, 255, 255, 0.1);
            --text-main: #FFFFFF;
            --text-muted: rgba(255, 255, 255, 0.65);
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #080d0b;
            color: var(--text-main);
            padding: 2.5rem 1.5rem;
            line-height: 1.6;
          }
          .container {
            max-width: 1040px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
          }
          .brand-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #FFFFFF;
            letter-spacing: -0.5px;
          }
          .brand-title span {
            color: var(--brand-gold);
          }
          .badge {
            background: rgba(15, 77, 58, 0.5);
            border: 1px solid rgba(15, 77, 58, 0.8);
            color: #6ee7b7;
            padding: 0.35rem 0.85rem;
            border-radius: 9999px;
            font-size: 0.8rem;
            font-weight: 600;
          }
          .intro {
            color: var(--text-muted);
            margin-bottom: 2rem;
            font-size: 0.95rem;
          }
          .intro a {
            color: #6ee7b7;
            text-decoration: none;
          }
          .intro a:hover { text-decoration: underline; }
          table {
            width: 100%;
            border-collapse: collapse;
            background: var(--bg-card);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--border-color);
          }
          th {
            background: rgba(15, 77, 58, 0.35);
            color: #FFFFFF;
            text-align: left;
            padding: 1rem 1.2rem;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
          }
          td {
            padding: 1rem 1.2rem;
            border-top: 1px solid var(--border-color);
            font-size: 0.9rem;
            color: var(--text-muted);
          }
          tr:hover td {
            background: rgba(255, 255, 255, 0.02);
          }
          td.url-cell {
            font-weight: 500;
          }
          td.url-cell a {
            color: #FFFFFF;
            text-decoration: none;
            transition: color 0.2s;
          }
          td.url-cell a:hover {
            color: #6ee7b7;
            text-decoration: underline;
          }
          .priority-tag {
            display: inline-block;
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid rgba(212, 175, 55, 0.4);
            color: #fde047;
            font-size: 0.78rem;
            padding: 0.15rem 0.5rem;
            border-radius: 6px;
            font-weight: 600;
          }
          .footer {
            margin-top: 2.5rem;
            text-align: center;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.4);
          }
          @media (max-width: 640px) {
            th:nth-child(3), td:nth-child(3) { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand-title">Aira <span>Paints</span> XML Sitemap</h1>
            <span class="badge">Official Search Index</span>
          </div>
          <p class="intro">
            This XML Sitemap informs search engine web crawlers (such as Googlebot and Bingbot) of all primary canonical URLs available on
            <a href="https://www.airapaints.com">airapaints.com</a>.
          </p>
          <table>
            <thead>
              <tr>
                <th style="width: 55%;">URL / Location</th>
                <th style="width: 15%;">Priority</th>
                <th style="width: 15%;">Change Frequency</th>
                <th style="width: 15%;">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td class="url-cell">
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <span class="priority-tag">
                      <xsl:value-of select="sitemap:priority"/>
                    </span>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <div class="footer">
            &copy; 2026 Aira Paints. All rights reserved. Tirupati, Andhra Pradesh, India.
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
