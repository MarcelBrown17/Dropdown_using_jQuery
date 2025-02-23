$(document).ready(function () {
  const searchInput = $("#searchInput");
  const dropdownList = $("#dropdownList");

  $.getJSON("https://raw.githubusercontent.com/MarcelBrown17/DropDown_JSON/main/list.json", function (data) {
    data.sort((a, b) => a.name.localeCompare(b.name));
    populateDropdown(data);
  });

  function populateDropdown(items) {
    items.forEach((item) => {
      dropdownList.append(`<a href="#">${item.name}</a>`);
    });

    searchInput.on("keyup", function () {
      filterDropdown($(this).val());
    });
  }

  function filterDropdown(query) {
    const filter = query.toLowerCase();
    const links = dropdownList.find("a");

    links.each(function () {
      const text = $(this).text().toLowerCase();

      if (text.includes(filter)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }

  searchInput.on("focus", function () {
    dropdownList.addClass("show");
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".dropdown").length) {
      dropdownList.removeClass("show");
    }
  });

  dropdownList.on("click", "a", function () {
    searchInput.val($(this).text());
    dropdownList.removeClass("show");
    highlightActiveItem($(this)); 
  });

  searchInput.on("keydown", function (e) {
    const visibleItems = dropdownList.find("a:visible");
    const currentIndex = visibleItems.index($(".highlighted"));

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % visibleItems.length;
      visibleItems.removeClass("highlighted active").eq(nextIndex).addClass("highlighted active");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      visibleItems.removeClass("highlighted active").eq(prevIndex).addClass("highlighted active");
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentIndex >= 0) {
        const selectedItem = visibleItems.eq(currentIndex);
        selectedItem.click();
        highlightActiveItem(selectedItem); 
      }
    }
  });

  function highlightActiveItem(item) {
    dropdownList.find("a").removeClass("active"); 
    item.addClass("active"); 
  }
});
