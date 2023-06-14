import { Directive } from 'vue'

const title: Directive = {
    created(_, binding) {
        document.title = binding.value
    },
}
export default title
