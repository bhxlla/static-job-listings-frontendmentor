const filtersSelected = new Set();
const filters = document.querySelector('.filter-cover');
const clear = document.querySelector('.clear');

const filterParent = filters.parentElement;

let data, main = document.querySelector('main'), realJobList = [];

fetch('data.json')
    .then(data => data.json())
    .then(res => {
        data = res;
        createList(data);
    });

function createList(data) {

    filterParent.classList.add('none');

    let docf = document.createDocumentFragment();
    data.forEach(el => {
        let listing = document.createElement('div');
        listing.classList.add('listing');

        let listFrag = document.createDocumentFragment();
        listing.companyName = el.company
        listing.data_filters = new Set([...el.languages, ...el.tools, el.role, el.level]);
        listing.data_filters.forEach(l => {
            let li = document.createElement('li');
            li.classList.add('job-filter');
            li.textContent = l;
            li.setAttribute('data-filter', l);
            listFrag.appendChild(li);
        })

        listing.innerHTML = `
        <div class="left">
            <div class="listing-img">
                <img src="${el.logo}" alt="">
            </div>
            <div class="company-details">
                <div class="company-nametags">
                    <h4 class="company-name">${el.company}</h4>
                    <div class="company-tags">
                        <p class="company-tag-new" style="display:${ el.new ? "block" : 'none'}" >NEW</p>
                        <p class="company-tag-ftrd" style="display:${ el.featured ? "block" : 'none'}" >FEATURED</p>
                    </div>
                </div>
                <h2 class="job-role">${el.position}</h2>
                <div class="job-min-details">
                    <p class="job-time">${el.postedAt}</p>
                    <p class="contOrFull">${el.contract}</p>
                    <p class="job-location">${el.location}</p>
                </div>
            </div>
        </div>
        <ul class="job-filters">
        </ul>
        ` ;

        listing.querySelector('.job-filters').append(listFrag);
        realJobList.push(listing);
        docf.append(listing);
    });

    main.append(docf);

    const filterBtns = document.querySelectorAll('.job-filters > .job-filter');

    filterBtns.forEach(el => {
        el.addEventListener('click', ev => {
            addFilter(el.dataset.filter);
        })
    })
}


function addFilter(filter) {

    if (filtersSelected.has(filter)) {
        return;
    }

    if (filtersSelected.size == 0) {
        filterParent.classList.remove('none');
        main.classList.add('main-space') ;
    }

    let newFilter = document.createElement('div');

    newFilter.classList.add('filter');

    newFilter.textContent = filter;

    newFilter.addEventListener('click', filterClick);

    newFilter.setAttribute('data-filter', filter);

    filters.append(newFilter);

    filtersSelected.add(filter);

    filterJobs();

}


function filterJobs() {

    realJobList.forEach(job => {

        if (check(filtersSelected, job.data_filters)) {
            showJob(job);
        } else {
            hideJob(job);
        }
    })
}

function filterClick(ev) {

    filtersSelected.delete(this.dataset.filter);

    console.log(filtersSelected) ;

    if (filtersSelected.size == 0) {
        filterParent.classList.add('none');
        main.classList.remove('main-space') ;
    }
    this.remove();
    filterJobs(this.dataset.filter);
}

function hideJob(job) {
    job.classList.add('fade');
    job.addEventListener('transitionend', ev => job.classList.add('none'), { once: true });
}


function showJob(job) {
    job.classList.remove('none');
    job.classList.add('fadeAnim');
    job.addEventListener('animationend', ev => job.classList.remove('fade', 'fadeAnim'), { once: true })
}


function check(set1, set2) {
    // to check if set2 contains all elements of set1
    let bool = false;
    if (set1.size == 0) {
        return true;
    }
    let i = 0;
    set1.forEach(s => {
        if (i == 0) {
            if (set2.has(s)) {
                bool = true;
            } else {
                i++;
                bool = false;
            }
        }
    })
    return bool;
}


clear.addEventListener('click', ev => {
    if (filtersSelected.size == 0) {
        return;
    }
    filtersSelected.clear();
    filterJobs();
    clearFilters();
})


function clearFilters() {
    while (filters.firstElementChild) {
        filters.lastElementChild.remove();
    }
    filterParent.classList.add('none');
    main.classList.remove('main-space') ;
}