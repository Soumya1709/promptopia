"use client"
import { useState, useEffect } from 'react';
import { useSession} from 'next-auth/react';
import { useRouter} from 'next/navigation';

import Profile from '@/components/Profile';


function MyProfile() {
    const { data:session } = useSession();
    const [posts,setPosts] = useState([]);
    const router = useRouter(); 

     useEffect(() => {
        // Fetch posts from the API and update the state
        const fetchPosts = async () => {
        
            const response = await fetch(`/api/users/${session?.user.id}/posts`);
            const data = await response.json();
            // Update the state with the fetched posts
             setPosts(data);
          }

          if(session?.user.id)fetchPosts();
      }, []);

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${posts._id}`)
    }

    const handleDelete = async() => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?");

        if(hasConfirmed){
            try{
                await fetch(`/api/prompt/${posts._id.toString()}`, {
                    method: 'DELETE'
                });

                const filteredPosts = posts.filter((p) => p._id !== posts._id);
                setPosts(filteredPosts);
            }catch(error){
                console.log(error);
            }
        }
    }
  return (
   <Profile
        name="My"
        desc="Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination." 
        data={[posts]}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
   />
  )
}

export default MyProfile
