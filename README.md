# Inlighn Tech Hackathon Project: Dynamic & Modern UI

This project was completed within a challenging **12-hour timeframe**, demonstrating rapid development and implementation of a visually stunning and functional website for Inlighn Tech.

## Design Theme: Modern Liquid Glass

The core visual theme for this website is a **modern liquid glass aesthetic** inspired from the modern shift in industry towards glass UI. This is achieved through:

* **Dark Backgrounds:** Utilizing `--primary-bg-color: #010001` and `--secondary-bg-color: #123338` for depth.

* **Translucent Glass Effects:** Extensive use of `background: rgba(...)` with `backdrop-filter: blur(...) saturate(...)` to create frosted glass elements.

* **Cyan/Teal Highlights:** `--primary-highlight: #4de6d3` and `--accent-color: #14574d` for glowing borders, text highlights, and interactive elements.

* **Dynamic Glows and Shadows:** Subtle to pronounced `box-shadow` effects that react on hover, simulating light refraction and depth.

* **Curvy and Sharp Elements:** A mix of `--border-radius: 20px` for general curvy sections and `--border-radius-sharp: 5px` for a more minimalist, precise look on specific components like pop-ups.

* **Smooth Transitions & Animations:** Consistent use of `transition` properties (e.g., cubic-bezier for bouncy effects) for all interactive elements, providing a fluid and engaging user experience.

## Implemented Features

From start to finish, the following key components and functionalities were integrated:

1.  **Loading Screen:** A visually appealing loader with a modern wave-like animation and a central glowing circle.

2.  **Interns of the Month Challenge Section:**

    * Dynamic title chip with hover effects.

    * Engaging section title with gradient text and glow.

    * Reward cards featuring a full-fill blue glow on hover, along with lift and text color change transitions.

3.  **Our Interns' Projects Section:**

    * A compelling layout showcasing a project screenshot and details.

    * Glassy project card with hover effects, including a blue fill and text color changes.

    * Responsive design ensuring optimal viewing on various screen sizes.

4.  **Perks & Benefits Section:**

    * Structured display of company benefits.

    * Interactive perk items with hover effects that fill, lift, and change icon/text colors.

    * Showcase for the ISO certificate image with depth and glow.

5.  **Frequently Asked Questions (FAQ) Section:**

    * Interactive accordion-style FAQ items.

    * Smooth open/close transitions for answers.

    * Plus/minus icon rotation on toggle for intuitive UX.

    * Glassy card styling consistent with the theme.

6.  **WhatsApp Chat Widget:**

    * Fixed, bottom-left floating WhatsApp icon.

    * Pop-up chatbox with a modern, glassy design.

    * Smooth open/close transitions for the chatbox.

    * Basic message sending functionality with simulated replies.

7.  **Login Pop-up:**

    * Activated by a dedicated "Login" button.

    * A responsive, modern, glassy pop-up for user authentication.

    * Features input fields for username/password and a submit button.

    * Basic mock login validation.

8.  **Verify Certificate Pop-up:**

    * Activated by a "Verify Portal" button.

    * A responsive, modern, glassy pop-up for certificate verification.

    * Sharper border-radius to differentiate its look slightly from the login.

    * Features an input field for Intern ID and a verify button.

    * Basic mock verification functionality.

## BOUNTY: Implementation of Blur Focus

**Description:** I have successfully implemented the "Blur Focus" effect in the **Programs Section**. This special feature gets activated when a program card is clicked, rather than on hover (as hover effects were already present, this adds a distinct interactive layer).

**Implementation Details:**

* **Activation:** The effect is triggered by a JavaScript `click` event listener on each program card.

* **Visual Effect:**

    * The clicked (focused) program card gets a prominent lift, scale, and a subtle 3D rotation, along with an intensified glow.

    * **All other non-focused program cards simultaneously dim in opacity and apply a blur filter**, creating a clear visual hierarchy and drawing the user's attention to the selected program.

* **Optimization:** This effect is well-optimized using CSS `transition` properties for `transform`, `opacity`, and `filter`, leveraging GPU acceleration for smooth performance.

* **Dynamic Rendering Support:** The Programs section, where this feature resides, is designed to support dynamic rendering. Currently, it renders data from a `data.json` file, but its architecture allows it to easily integrate with an API call at any time, making it scalable and robust.

This implementation ensures a highly interactive and visually engaging user experience that goes beyond standard hover effects.
