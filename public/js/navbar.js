const titleContainer = document.getElementById('title-container');

titleContainer.addEventListener('mouseover', () => {
  const title = document.getElementById('title');
  title.classList.remove('has-text-white');
  title.classList.add('has-text-dark');

  const iconContainer = document.getElementById('icon-container');
  iconContainer.classList.remove('has-text-white');
  iconContainer.classList.add('has-text-dark');
});

titleContainer.addEventListener('mouseout', () => {
  const title = document.getElementById('title');
  title.classList.remove('has-text-dark');
  title.classList.add('has-text-white');

  const iconContainer = document.getElementById('icon-container');
  iconContainer.classList.remove('has-text-dark');
  iconContainer.classList.add('has-text-white');
});

document.addEventListener('DOMContentLoaded', () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll('.navbar-burger'),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
      el.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const { target } = el.dataset;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});
