<script setup>

    import {onMounted, ref} from 'vue'
    import UserService from '@/UserService';

    const users = ref([])
    const error = ref('')
    const showCreateCustomerModal = ref(false) 
    const activeProfile = ref([])
    const showDeleteUserModal = ref(false) 
    const showEditUserModal = ref(false) 
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const loading = ref(true)
    const deleteLoading = ref(false)
    const editLoading = ref(false)
    const createLoading = ref(false)
    const snackbar = ref(false)
    const snackbarText = ref('')


    onMounted (async () => {
        try {
            users.value = await UserService.getUsers()
            activeProfile.value = users.value[0]
            loading.value = false
        }
        catch(err) {
            error.value = err.message
        }
    })

    const firstNameRules = [
        value => {
            if (value?.length > 3) return true
            return 'First name must be at least 3 characters.'
        }
    ]

    const lastNameRules = [
        value => {
            if (value?.length > 3) return true
            return 'Last name must be at least 3 characters.'
        }
    ]

    const emailRules = [
        value => {
            if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
             return 'Must be a valid e-mail.'
        }
    ]

    async function deleteUser() {
        deleteLoading.value = true
        await UserService.deleteUser(activeProfile.value._id)
        users.value = await UserService.getUsers()

        showDeleteUserModal.value = false
        deleteLoading.value = false
        snackbarText.value = `Successfully deleted customer`
        snackbar.value = true
    }

    async function createUser() {
        createLoading.value = true
        await UserService.createUser(firstName.value, lastName.value, email.value)
        users.value = await UserService.getUsers()
        createLoading.value = false
        showCreateCustomerModal.value = false
        snackbarText.value = `Successfully created customer`
        snackbar.value = true
    }

    async function updateUser() {
        editLoading.value = true
        await UserService.updateUser(activeProfile.value._id, activeProfile.value.firstname, activeProfile.value.lastname, activeProfile.value.email)
        users.value = await UserService.getUsers()
        editLoading.value = false
        showEditUserModal.value = false
        snackbarText.value = `Successfully updated customer`
        snackbar.value = true
    }

</script>


<template>
    <v-container>
        <v-card class="mt-5" >
            <v-layout>
                <v-navigation-drawer permanent>
                    <v-list density="compact" nav>
                            <v-list-item class="text-center" v-if="loading">
                                <v-progress-circular 
                            :size="35"
                            :width="3"
                            color="grey"
                            indeterminate
                            ></v-progress-circular>
                            </v-list-item>
                        <!-- <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/75.jpg" title="Jane Doe" value="Jane Doe"></v-list-item>
                        <v-list-item prepend-avatar="https://i1.sndcdn.com/artworks-0EgHrWMz1UMPzydf-WDPNsg-t240x240.jpg" title="Dreamy Bull" value="Dreamy Bull"></v-list-item> -->
                        <v-list-item @click="activeProfile = user" v-for="user in users" :key="user._id" prepend-avatar="/profile/Ca1pture.PNG" :title="user.firstname + ' ' + user.lastname" :value="user._id"></v-list-item>
                        <v-list-item prepend-icon="mdi-plus" title="Add customer" value="new customer" @click="showCreateCustomerModal = true"></v-list-item>
                        
                    </v-list>
                </v-navigation-drawer>
                
                <v-main style="height: 250px" >
                   
                    <v-row class="ms-3 mt-1">
                        <v-col cols="8">
                            <h2>{{ activeProfile.firstname + ' ' + activeProfile.lastname }} </h2>
                        </v-col>
                        <v-col cols="1">
                            <v-btn color="blue" @click="showEditUserModal = true">Edit</v-btn>
                        </v-col>
                        <v-col cols="2">
                            <v-btn color="red" @click="showDeleteUserModal = true">Delete</v-btn>
                        </v-col>
                    </v-row>

                    <v-container>
                        <v-divider class="mb-3"></v-divider>

                        <v-row>
                            <v-col cols="6">
                                <p>User ID</p>
                                <span>{{ activeProfile._id }}</span>
                            </v-col>
                            <v-col cols="6">
                                <p>Email</p>
                                <span>{{ activeProfile.email }}</span>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <p>First name</p>
                                <span>{{ activeProfile.firstname }}</span>
                            </v-col>
                            <v-col cols="6">
                                <p>Last name</p>
                                <span>{{ activeProfile.lastname }}</span>
                            </v-col>
                        </v-row>

                        <v-dialog
                        v-model="showCreateCustomerModal"
                        persistent
                        width="50%"
                        >
                            <v-card>
                                        <v-form fast-fail @submit.prevent id="createUserForm">
                                            <v-card-title class="text-center">Create Customer Form</v-card-title>
                                            <v-divider class="mb-3"/>
                                        <v-text-field
                                            v-model="firstName"
                                            label="First name"
                                            :rules="firstNameRules"
                                        ></v-text-field>

                                        <v-text-field
                                            v-model="lastName"
                                            label="Last name"
                                            :rules="lastNameRules"
                                        ></v-text-field>

                                        <v-text-field
                                            v-model="email"
                                            label="Email"
                                            :rules="emailRules"
                                        ></v-text-field>
                                        <v-card-actions>
                                            <v-btn color="red"  @click="showCreateCustomerModal = false">Close</v-btn>
                                            <v-btn type="submit" color="success" @click="createUser()">
                                                <v-progress-circular v-if="createLoading"
                                                    :size="20"
                                                    :width="2"
                                                    color="grey"
                                                    indeterminate
                                                    ></v-progress-circular>
                                                            <label v-else>Create</label></v-btn>
                                        </v-card-actions>
                                        </v-form>
                                
                            </v-card>
                        </v-dialog>

                        <v-dialog
                        v-model="showEditUserModal"
                        width="50%"
                        >
                            <v-card>
                                <v-form fast-fail @submit.prevent id="createUserForm">
                                            <v-card-title class="text-center">Edit Customer Form</v-card-title>
                                            <v-divider class="mb-3"/>
                                        <v-text-field
                                            v-model="activeProfile.firstname"
                                            label="First name"
                                            :rules="firstNameRules"
                                        ></v-text-field>

                                        <v-text-field
                                            v-model="activeProfile.lastname"
                                            label="Last name"
                                            :rules="lastNameRules"
                                        ></v-text-field>

                                        <v-text-field
                                            v-model="activeProfile.email"
                                            label="Email"
                                            :rules="emailRules"
                                        ></v-text-field>
                                        <v-card-actions>
                                            <v-btn color="red"  @click="showEditUserModal = false">Close</v-btn>
                                            <v-btn type="submit" color="success" @click="updateUser()">
                                                <v-progress-circular v-if="editLoading"
                                                :size="20"
                                                :width="2"
                                                color="grey"
                                                indeterminate
                                                ></v-progress-circular>
                                                <label v-else>Update</label>
                                            </v-btn>
                                        </v-card-actions>
                                        </v-form>
                            </v-card>
                        </v-dialog>

                        <v-dialog
                        v-model="showDeleteUserModal"
                        width="auto"
                        >
                            <v-card>
                                <v-card-text>
                                Are you sure you want to delete {{ activeProfile.firstname + ' ' + activeProfile.lastname }}
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="green-darken-1"
                                        variant="text"
                                        @click="showDeleteUserModal = false"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-btn
                                        color="red-darken-1"
                                        variant="text"
                                        @click="deleteUser()"
                                    >
                                    <v-progress-circular v-if="deleteLoading"
                            :size="20"
                            :width="2"
                            color="grey"
                            indeterminate
                            ></v-progress-circular>
                                    <label v-else>Delete</label>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-snackbar
                            v-model="snackbar"
                            >
                            {{ snackbarText }}

                            <template v-slot:actions>
                                <v-btn
                                color="pink"
                                variant="text"
                                @click="snackbar = false"
                                >
                                Close
                                </v-btn>
                            </template>
                            </v-snackbar>
                            
                        
                    </v-container>
                </v-main>
                <!-- <v-main v-else>
                    <v-container class="text-center">
                        No Customers found...
                    </v-container>
                </v-main> -->
        </v-layout>
  </v-card>
</v-container>
</template>

<style scoped>

    p {
        color:gray
    }

    span {
        margin-left: 20px;
        font-size: 19px;
    }

    #createUserForm{
        margin: 20px;
    }


</style>

