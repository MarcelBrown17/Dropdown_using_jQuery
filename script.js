$(document).ready(function () {
  const searchInput = $("#searchInput");
  const dropdownList = $("#dropdownList");

  // Fetches the json file
  $.getJSON("https://raw.githubusercontent.com/MarcelBrown17/DropDown_JSON/main/list.json", function (data) {
    data.sort((a, b) => a.name.localeCompare(b.name));
    populateDropdown(data);
  });

  // Function that populates the dropdown with items
  function populateDropdown(items) {
    // Loop through each item
    // Append it as an <a> element to dropdownContent
    items.forEach((item) => {
      dropdownList.append(`<a href="#">${item.name}</a>`);
    });

    // Search filters everytime the key is up
    searchInput.on("keyup", function () {
      filterDropdown($(this).val());
    });
  }

  // Function to filter the dropdown items based on the input query
  function filterDropdown(query) {
    // Converts the Query to Lowercase:
    const filter = query.toLowerCase();
    // Finds all "a" tags in the dropdown list
    // It is appending "a" because I appended the items as an <a>
    const links = dropdownList.find("a");

    // Shows links that match the query and hides the other dropdown list content
    links.each(function () {
      // Get the text content of the current link and convert it to lowercase
      const text = $(this).text().toLowerCase();

      // Checks if the link's text includes the filter text
      if (text.includes(filter)) {
        // Show the link if its text matches the filter/query
        $(this).show();
      } else {
        // Hide the link if its text does not match the filter/query
        $(this).hide();
      }
    });
  }

  // Shows the dropdown list/content when the search is focused
  searchInput.on("focus", function () {
    dropdownList.addClass("show");
  });

  // Hides the dropdown list when clicking outside of the dropdown
  $(document).on("click", function (e) {
    // This checks if the click happened outside the dropdown.
    if (!$(e.target).closest(".dropdown").length) {
      // This hides the dropdown menu if the click was outside of it.
      dropdownList.removeClass("show");
    }
  });

  // Set the input value to the selected item's text and hide the dropdown
  dropdownList.on("click", "a", function () {
    // This sets the input box to the text of the clicked item.
    searchInput.val($(this).text());
    //This hides the dropdown menu after the above has been clicked on.
    dropdownList.removeClass("show");
  });

  // Sets the search to the selected dropdown item text and hides the dropdown
  dropdownList.on("click", "a", function () {
    searchInput.val($(this).text());
    dropdownList.removeClass("show");
    // Highlight the active item when clicked
    highlightActiveItem($(this));
  });

  searchInput.on("keydown", function (e) {
    const visibleItems = dropdownList.find("a:visible");
    const currentIndex = visibleItems.index($(".highlighted"));

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % visibleItems.length;
      visibleItems
        .removeClass("highlighted active")
        .eq(nextIndex)
        .addClass("highlighted active");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex =
        (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      visibleItems
        .removeClass("highlighted active")
        .eq(prevIndex)
        .addClass("highlighted active");
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentIndex >= 0) {
        const selectedItem = visibleItems.eq(currentIndex);
        selectedItem.click();
        // Highlight the active item when its selected
        highlightActiveItem(selectedItem);
      }
    }
  });
  
  // Function to highlight the active <a> in the dropdown
  function highlightActiveItem(item) {
    // Remove active class from all items
    dropdownList.find("a").removeClass("active");
    // Add active class to the selected <a>
    item.addClass("active");
  }
});
