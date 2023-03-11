document.addEventListener('DOMContentLoaded', () => {

    /*
        global varebles
    */

    const reposContainer = document.querySelector('.repos-wrapper')

    /*
        click events
    */

    find_button.addEventListener('click', (e) => {
        findRepos()
    })

    /*
        input events
    */

    find_input.addEventListener('input', (e) => {
        inputStatus(e.target)
    })

    /*
        keydown events
    */

    // enter event
	find_form.addEventListener('keydown', (e) => {
		if (e.keyCode == 13) {
			e.preventDefault();
			findRepos()
		}
	});


    /*
        functions
    */

    function findRepos() {
        if (validateField(find_input)) return

        setLouder(find_button)
        const repos = fetch(`https://api.github.com/search/repositories?q=${find_input.value}&per_page=5`)

        repos.then((res) => res.json()).then((obj) => {
            if (!obj.total_count) return notFound()

            clearContainer(reposContainer)

            for (const item of obj.items) {
                const repo = createRepoCart(item)
                reposContainer.append(repo)
            }
            unSetLouder(find_button)
        })
    }

    function createRepoCart(obj) {
        const repo = document.createElement('article')
        repo.classList.add('repository')
        repo.innerHTML = `
            <img class="repository__avatar" src="${obj.owner.avatar_url}" alt="">

            <a href="${obj.owner.html_url}" class="repository__username">${obj.owner.login}</a>

            <p class="repository__name"><a href="${obj.html_url}">${obj.name}</a><span class="repository__last-update">обновлено: ${formatDate(new Date(obj.updated_at))}</span></p>
            
            <p class="repository__description">${obj.description}</p>
            
            <a class="repository__link" href="${obj.html_url}">Перейти</a>
        `
        return repo
    }

    function validateField(input) {
        if (!input.value) {
            setErrorInput(input, 'Поле не должно быть пустым')
            return true
        }
        unsetErrorInput(input)
        return false
    }

    function inputStatus(input) {
		if (input.value) {
			input.classList.add('app-form__input-active')
			input.classList.remove('app-form__input-error')
			unsetErrorInput(input)
			return
		}
		input.classList.remove('app-form__input-active')
	}

    function setErrorInput(input, message) {
        input.setAttribute('placeholder', message)
        input.value = ''
		input.classList.add('app-form__input-error')
    }

	function unsetErrorInput(input) {
		input.classList.remove('app-form__input-error')
		input.removeAttribute('placeholder')
	}

    function clearContainer(container) {
        container.innerHTML = ''
    }

    function setLouder(element) {
        element.innerHTML = '<i class="fa fa-circle-o-notch" aria-hidden="true"></i>'
    }

    function unSetLouder(element) {
        element.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>'
    }

    function notFound() {
        const element = document.createElement('p')
        element.classList.add('repository-not-found')
        element.innerHTML = 'По вашему запросу ничего не найдено'

        clearContainer(reposContainer)
        reposContainer.append(element)
        unSetLouder(find_button)
    }

    function padTo2Digits(num) {
		return num.toString().padStart(2, '0');
	}

    function formatDate(date) {
		return [
			padTo2Digits(date.getDate()),
			padTo2Digits(date.getMonth() + 1),
			date.getFullYear(),
		].join('.');
	}

})
