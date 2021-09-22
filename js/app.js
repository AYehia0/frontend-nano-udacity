
/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
 * 
*/

// build the nav bar by getting the ids of the main sections
const buildNavLinks = (sections) => {

    const ulEl = document.getElementById('navbar__list')

    sections.forEach(section => {

        // creating the el
        const liEl = document.createElement('li')

        // getting data-attr 
        const sectionName = section.getAttribute('data-nav')
        const liId = section.id.replace('section', 's')

        // modifiying the li element
        liEl.innerText = sectionName
        liEl.id = liId
        liEl.className = 'menu__link'

        // appending 
        ulEl.appendChild(liEl)
    })
}


// getting all the nav links 
const sections = document.querySelectorAll('section')
buildNavLinks(sections)
const navSectionLinks = document.querySelectorAll('.menu__link')

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

// get a section id from the menu__link li element
const generateSectionId = (menuElement) => {
    return menuElement.id.replace('s', 'section')
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// make sure there is only one active link at a time
const ensureActiveStatus = (elemntList, activeClass) => {

    // getting all menu links classes
     elemntList.forEach(el => {

        const status = el.classList
        if (status.contains(activeClass)) {
            // remove it 
            status.remove(activeClass)
        }
    })
}

// Scroll to a section by its id
const scrollToSectionById = (sectionId) => {

    // scrolling options
    const scrollOpts = {
        behavior: "smooth",
        block: "start",
        inline: "nearest"
    }

    // getting the element by its id
    const section = document.querySelector(`#${sectionId}`)

    // check if section doesn't exist
    if (!section)
        return null

    // scrolling to it using scrollIntoView : https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    section.scrollIntoView(scrollOpts)
}

// observer options 
const observerOpts = {
    root: null, // it's in the viewport
    threshold: 0.7, // the thershold decides 70% of the content are in the spot to fire
    //rootMargin: "-200px"
}

// Scrolling observer
const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {

        // checking for itersecting
        // to prevent firing when page is opened the first time
        if (!entry.isIntersecting){
            return
        }

        // checking the id
        const entryId = entry.target.id

        console.log(entryId)

        // change the nav status to active 
        ensureActiveStatus(navSectionLinks, "active")
        ensureActiveStatus(sections, "your-active-class")

        // getting the li element linked to that section 
        // add active  
        document.querySelector(`#${entryId.replace('section', 's')}`).classList.toggle('active')
        document.querySelector(`#${entryId}`).classList.add('your-active-class')
       
    })

}, observerOpts)


navSectionLinks.forEach(navSection => {
    navSection.addEventListener('click', () => {

        // getting the section id it suppose to go to 
        const sectionIdToGo = generateSectionId(navSection)

        // toggling active in menu
        navSection.classList.toggle('active')

        // toggling active in section
        document.querySelector(`#${sectionIdToGo}`).classList.add('your-active-class')


        //console.log(`clicked: ${navSection.id}, ${sectionIdToGo}`)

        // scroll to the section 
        scrollToSectionById(sectionIdToGo)

    })
})

// observer thing
sections.forEach(section => {
    sectionObserver.observe(section)
})