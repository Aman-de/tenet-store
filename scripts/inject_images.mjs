import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'lib/sanity.ts');
let content = fs.readFileSync(file, 'utf8');

// 1. Inject into IMAGE_OVERRIDES
const newOverrides = `
    "the archive cable knit zip": { alt: "/images/generated/the_archive_cable_knit_zip_real_alt_1779834991531.png" },
    "the tailored gurkha trouser": { alt: "/images/generated/the_tailored_gurkha_trouser_real_alt_1779835004621.png" },
    "the voyager leather duffel": { alt: "/images/generated/the_voyager_leather_duffel_real_alt_1779835023131.png" },
    "the heritage chronograph": { alt: "/images/generated/the_heritage_chronograph_real_alt_1779835038886.png" },
    "the weekender": { alt: "/images/generated/the_weekender_real_alt_1779835054425.png" },
    "the hamptons weekend edit": { alt: "/images/generated/the_hamptons_weekend_edit_real_alt_1779835085127.png" },
    "the amalfi stripe": { alt: "/images/generated/the_amalfi_stripe_real_alt_1779835100941.png" },
    "the sterling cashmere vest": { alt: "/images/generated/the_sterling_cashmere_vest_real_alt_1779835117652.png" },
    "the mediterranean retreat edit": { alt: "/images/generated/the_mediterranean_retreat_edit_real_alt_1779835132820.png" },
    "the desert boot": { alt: "/images/generated/the_desert_boot_real_alt_1779835147605.png" },
    "the bridle leather belt": { alt: "/images/generated/the_bridle_leather_belt_real_alt_1779835179855.png" },
    "the textured knit polo": { alt: "/images/generated/the_textured_knit_polo_real_alt_1779835195655.png" },
    "the heritage cable knit": { main: "/images/generated/the_heritage_cable_knit_real_main_1779835220987.png" },
`;

content = content.replace(/const IMAGE_OVERRIDES: Record<string, \{ main\?: string, alt\?: string \}> = \{/, "const IMAGE_OVERRIDES: Record<string, { main?: string, alt?: string }> = {\n" + newOverrides);

// 2. Inject into ARTIFICIAL_PRODUCTS
content = content.replace(/"\/images\/generated\/the_archive_cable_knit_zip_alt_1779785469898\.png"\]/g, '"/images/generated/the_archive_cable_knit_zip_alt_1779785469898.png", "/images/generated/the_alpine_cable_knit_alt_1779835239375.png"]');

content = content.replace(/"\/images\/generated\/the_tailored_gurkha_trouser_alt_1779785496750\.png"\]/g, '"/images/generated/the_tailored_gurkha_trouser_alt_1779785496750.png", "/images/generated/the_minimalist_gurkha_trouser_alt_1779835253569.png"]');

content = content.replace(/"\/images\/generated\/the_voyager_leather_duffel_alt_1779785533301\.png"\]/g, '"/images/generated/the_voyager_leather_duffel_alt_1779785533301.png", "/images/generated/the_artisan_leather_duffel_alt_1779835289705.png"]');

content = content.replace(/"\/images\/generated\/the_heritage_chronograph_alt_1779785550608\.png"\]/g, '"/images/generated/the_heritage_chronograph_alt_1779785550608.png", "/images/generated/the_onyx_chronograph_alt_1779835307570.png"]');


fs.writeFileSync(file, content);
console.log("Images injected!");
