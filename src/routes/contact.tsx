import { ActionFunction, Form, LoaderFunction, useFetcher, useLoaderData } from 'react-router-dom';
import { getContact, updateContact } from '../contacts';
import { Contact as ContactType } from '../types';

export const loader: LoaderFunction = async ({ params }) => {
  return getContact(params.contactId as string);
};

export const action: ActionFunction = async ({ request, params }) => {
  let formData = await request.formData();
  return updateContact(params.contactId as string, {
    favorite: (formData.get('favorite') as string) === 'true',
  });
};

export default function Contact() {
  const contact = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  if (!contact) {
    throw new Response('', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || undefined} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: ContactType }) {
  const fetcher = useFetcher();
  let favorite = contact.favorite;

  if (fetcher.formData) {
    favorite = fetcher.formData.get('favorite') === 'true';
  }

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  );
}
